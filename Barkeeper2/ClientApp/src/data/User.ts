import authService from "@components/api-authorization/AuthorizeService";
import type { Profile } from "oidc-client";
import { useQuery } from "react-query";

export function useCurrentUser() {
    return useQuery<Profile>("active-user", () => authService.getUser());
}