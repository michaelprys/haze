import type { Location } from 'src/types/location.types';
import type { Post } from 'src/types/post.types';
import { delay } from 'src/utils/delay.utils';
import { computed, ref, type Ref } from 'vue';
import { useQuasar } from 'quasar';

export const useGeolocation = (post: Ref<Post>) => {
    const $q = useQuasar();
    const locationPending = ref(false);
    const latitude = ref<number | null>(null);
    const longitude = ref<number | null>(null);
    const hasGeolocation = computed(() => 'geolocation' in navigator);

    const getLocation = async () => {
        if (!hasGeolocation.value) {
            $q.notify({ type: 'negative', message: 'Geolocation not supported' });

            return;
        }

        locationPending.value = true;

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 7000 }),
            );

            latitude.value = position.coords.latitude;
            longitude.value = position.coords.longitude;

            await getPreciseLocation(position);
        } catch (error) {
            console.error('Geolocation error:', error);
            $q.notify({ type: 'negative', message: 'Could not find the location' });
        } finally {
            await delay(500);
            locationPending.value = false;
        }
    };

    const getPreciseLocation = async (position: GeolocationPosition) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(response.statusText);

            const data = (await response.json()) as Location;
            post.value.location = `${data.address.city}, ${data.address.country}`;
        } catch (error) {
            console.error('Failed to get precise location:', error);
        }
    };

    return {
        locationPending,
        latitude,
        longitude,
        hasGeolocation,
        getLocation,
        getPreciseLocation,
    };
};
