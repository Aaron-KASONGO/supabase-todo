import supabase from "../config/SupabaseClient"
import { useState, useEffect } from 'react'


const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);

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
    
    fetchSmoothies();
  }, []);

  return (
    <div className="page home">
      {fetchError && (<p>{fetchError}</p>)}
      {smoothies && (
        <div className="smoothies">
          {smoothies.map(smoothie => (
            <p key={smoothie.id}>{smoothie.title}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home