import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your project's URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
});

async function testProfileCreation() {
  console.log('Starting profile creation test...');

  // 1. First, check if we can connect to Supabase
  console.log('Testing Supabase connection...');
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('❌ Error connecting to Supabase:', sessionError.message);
    return;
  }
  
  console.log('✅ Connected to Supabase');

  // 2. Sign up a test user
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'test-password-123';
  
  console.log(`Creating test user: ${testEmail}`);
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
  });

  if (signUpError) {
    console.error('❌ Error creating test user:', signUpError.message);
    return;
  }

  const userId = signUpData.user?.id;
  console.log(`✅ Test user created with ID: ${userId}`);

  if (!userId) {
    console.error('❌ No user ID returned after signup');
    return;
  }

  // 3. Wait a moment for the trigger to execute
  console.log('Waiting for profile creation...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. Check if the profile was created
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profileData) {
    console.error('❌ Profile was not created automatically');
    
    if (profileError) {
      console.error('Error fetching profile:', profileError.message);
    }
    
    // Try to create the profile manually
    console.log('Attempting to create profile manually...');
    const { data: manualProfile, error: manualError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: testEmail,
        full_name: 'Test User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (manualError || !manualProfile) {
      console.error('❌ Failed to create profile manually:', manualError?.message || 'Unknown error');
      return;
    }
    
    console.log('✅ Profile created manually');
  } else {
    console.log('✅ Profile was created automatically');
    console.log('Profile data:', profileData);
  }

  // 5. Clean up (optional)
  console.log('\nTest completed. You may want to delete the test user from the Supabase dashboard.');
  console.log(`Test user email: ${testEmail}`);
  console.log(`Test user ID: ${userId}`);
}

testProfileCreation().catch(console.error);
