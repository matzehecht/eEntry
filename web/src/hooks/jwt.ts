import { useMemo } from 'react';
import jwt_decode from 'jwt-decode';
import { useCookies } from 'react-cookie';

type DecodedJWT = {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  roles?: string;
  sub: string;
};

const useDecodedJWT = () => {
  const [{ JWT }] = useCookies(['JWT']);
  return useMemo(() => {
    if (!JWT) {
      return undefined;
    }
    return jwt_decode<DecodedJWT>(JWT);
  }, [JWT]);
};

export const useJWTRoles = () => {
  const decoded = useDecodedJWT();

  return useMemo(() => {
    if (!decoded) {
      return undefined;
    }

    if (!decoded.roles) {
      return undefined;
    }

    return decoded.roles.split(' ');
  }, [decoded]);
};

// export const useHasRole = (role: string) => {
//   const roles = useJWTRoles();

//   return useMemo(() => roles?.includes(role) ?? false, [role, roles]);
// };
