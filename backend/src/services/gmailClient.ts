import { google } from 'googleapis'
import { User } from '../types/auth'
import { GmailEmail } from '../types/gmail'
import { supabase } from '../lib/supabase'

export class GmailApiClient {
  private oauth2Client: any

  constructor(private readonly user: User) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    )
  }

  private async getAccessToken(): Promise<string> {
    // Get access token from Supabase session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session?.user) {
      throw new Error('User not authenticated')
    }
    return session.access_token
  }

  async fetchEmails(maxResults: number = 100, pageToken?: string): Promise<GmailEmail[]> {
    const accessToken = await this.getAccessToken()
    this.oauth2Client.setCredentials({ access_token: accessToken })

    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      pageToken,
      includeSpamTrash: false
    })

    const messages = response.data.messages || []
    const emails: GmailEmail[] = []

    // Fetch details for each message
    for (const message of messages) {
      if (!message.id) continue; // Skip messages without an ID
      
      const response = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!
      })

      const email = this.parseMessage(response.data)
      if (email) {
        emails.push(email)
      }
    }

    return emails
  }

  private parseMessage(message: any): GmailEmail | null {
    if (!message || !message.payload) return null

    const headers = message.payload.headers || []
    const getHeader = (name: string) => {
      const header = headers.find((h: { name: string }) => h.name === name)
      return header?.value || ''
    }

    // Get message body
    let body = ''
    const parts = message.payload.parts || [message.payload]
    for (const part of parts) {
      if (part.mimeType === 'text/plain') {
        const decoded = Buffer.from(part.body.data, 'base64').toString()
        body += decoded
      }
    }

    return {
      id: message.id,
      threadId: message.threadId,
      from: getHeader('From'),
      to: getHeader('To'),
      subject: getHeader('Subject'),
      body,
      date: getHeader('Date'),
      labels: message.labelIds || [],
      importance: 'normal' // TODO: Implement importance detection
    }
  }
}
