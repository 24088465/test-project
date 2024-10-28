
export const fetchActivitiesAndProposals = async (id) => {
    const apiUrl = `http://101.201.105.132:8090/activity/page?id=${id}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch activities and proposals');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching activities and proposals:', error);
      throw error;
    }
  };
  