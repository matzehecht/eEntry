import jwt_decode from 'jwt-decode';
import { api } from './api';
import { TAG_CHECK_AUTH } from './api.auth.tags';

type OptionalRole = {
  roles?: string | string[];
};
type DeviceToken = {
  token: string;
};

type JWT = {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  roles: string;
  sub: string;
};

const endpointsAuth = api.injectEndpoints({
  endpoints: (builder) => ({
    checkAuth: builder.query<boolean, OptionalRole | void>({
      providesTags: [TAG_CHECK_AUTH],
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const url = `auth`;
        const opts = arg ? { params: arg, url } : { url };
        const response = await baseQuery(opts);

        return { data: !response.error };
      },
    }),
    login: builder.mutation<JWT, DeviceToken & OptionalRole>({
      invalidatesTags: [TAG_CHECK_AUTH],
      queryFn: async ({ token, roles }, api, extraOptions, baseQuery) => {
        const response = await baseQuery({
          headers: { token },
          params: roles !== undefined ? { roles } : undefined,
          url: 'auth/login',
        });

        if (response.error) {
          throw response.error;
        }

        const jwt = document.cookie
          .split(';')
          .find((row) => row.startsWith('JWT='))
          ?.split('=')[1];

        if (!jwt) {
          throw new Error('No JWT');
        }

        const decoded = jwt_decode<JWT>(jwt);

        if (!decoded || typeof decoded === 'string') {
          throw new Error('Error while decoding');
        }

        return {
          ...response,
          data: decoded,
        };
      },
    }),
  }),
});

export const { useCheckAuthQuery, useLoginMutation } = endpointsAuth;
