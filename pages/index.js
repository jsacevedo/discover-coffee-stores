import Head from 'next/head';
import Image from 'next/image/';
import { useContext, useEffect, useState } from 'react';

import styles from '../styles/Home.module.css';
import Banner from '../components/banner';
import Card from '../components/card';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: { coffeeStores }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  useEffect(() => {
    const setCoffeeStoresByLocation = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );

          const coffeeStores = await response.json();

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          setCoffeeStoresError('');
          // Set coffee stores
        } catch (error) {
          // Set error
          setCoffeeStoresError(error.message);
        }
      }
    };
    setCoffeeStoresByLocation();
  }, [latLong, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Allows you to discover Coffee Stores"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="Hero Image"
          />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores Near Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    className={styles.card}
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Surprise Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    className={styles.card}
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
