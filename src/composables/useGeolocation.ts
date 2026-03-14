import type { Location } from 'src/types/location.types';
import type { Ref } from 'vue';
import type { Post } from 'src/types/post.types';
import { api } from 'boot/axios';
import { computed, ref } from 'vue';
import { delay } from 'src/utils/delay.utils';
import { useQuasar } from 'quasar';

export const useGeolocation = (post: Ref<Post>) => {
    const locationPending = ref(false),
        latitude = ref<number | null>(null),
        longitude = ref<number | null>(null),
        hasGeolocation = computed(() => 'geolocation' in navigator),
        $q = useQuasar();

    const getLocation = async () => {
        try {
            locationPending.value = true;

            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 7000 });
            });
            latitude.value = position.coords.latitude;
            longitude.value = position.coords.longitude;

            await getPreciseLocation(position);
        } catch (error) {
            console.error('Geolocation not found: ', error);

            $q.notify({
                type: 'negative',
                message: 'Could not find the location',
            });
        } finally {
            await delay(500);
            locationPending.value = false;
        }
    };

    const getPreciseLocation = async (position: GeolocationPosition) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;

        try {
            const { data } = await api.get<Location>(url);

            post.value.location = `${data.address.city}, ${data.address.country}`;
        } catch (error) {
            console.error(error);
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
