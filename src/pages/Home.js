import supabase from "../config/SupabaseClient"
import { useState, useEffect } from 'react'


const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);

  const [user, setUser] = useState(null);

  const fetchSmoothies = async () => {
    const {data, error} = await supabase
      .from('smoothies')
      .select()

      if (error) {
        setFetchError('Could not fetch the smoothies');
        setSmoothies(null);
      }

      if (data) {
        setSmoothies(data);
        setFetchError(null);
      }
  }

  useEffect(() => {
    const data = supabase.auth.getSession();

    data.then((response) => setUser(response.data.session.user))

    supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          data.then((response) => {
            setUser(response.data.session.user)
            console.log(response.data.session.user)
          })
          break;
        
        case 'SIGNED_OUT':
          setUser(null)
        default:
          break;
      }
    })

    fetchSmoothies();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="page home">
      {
        user ?
        (

          // fetchError && (<p>{fetchError}</p>)
          smoothies && (
            <div className="smoothies">
              {smoothies.map(smoothie => (
                <p key={smoothie.id}>{smoothie.title}</p>
              ))}
              <button onClick={logout}>logout</button>
            </div>
          )
        ):
        (
          <div>
            <button onClick={login}>Login with github</button>
            
          </div>
        )
      }
    </div>
  )
}

export default Home