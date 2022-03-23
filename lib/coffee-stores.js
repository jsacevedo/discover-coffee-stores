// Initialize Unsplash API
import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls['small']);
};

const getUrlForCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  latLong = '33.70170436907221,-112.40922178842942',
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(latLong, 'coffee shops', limit),
    options
  );

  const data = await response.json();

  return data.results.map((venue, idx) => {
    const neighborhood = venue.location.neighborhood;
    return {
      id: venue.fsq_id,
      address: venue.location.address,
      name: venue.name,
      neighborhood:
        (neighborhood && neighborhood.length > 0 && neighborhood[0]) ||
        venue.location.cross_street ||
        '',
      imgUrl: photos[idx],
    };
  });
};
