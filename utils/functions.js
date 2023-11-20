
export const fetcher = async (url) => {

    return fetch(process.env.NEXT_PUBLIC_WP_API_URL + url, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      mode: 'cors',
    })
  }

export const poster = async (url, data, method) => {
  
    return fetch(process.env.NEXT_PUBLIC_WP_API_URL + url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method,
      body: JSON.stringify(data),
      credentials: 'include',
      mode: 'no-cors',
    })
  }
