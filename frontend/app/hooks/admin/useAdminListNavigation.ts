"use client";

import { startTransition, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { buildAdminListHref } from "@/lib/filter/admin-list";

type QueryValue = string | number | undefined;

export function useAdminListNavigation<T extends Record<string, QueryValue>>(
    initialState: T
) {
    const pathname = usePathname();
    const router = useRouter();
    const [state, setState] = useState<T>(initialState);
    const stateRef = useRef<T>(initialState);

    const buildHref = (patch: Partial<T> = {}) =>
        buildAdminListHref(pathname, { ...stateRef.current, ...patch });

    const updateState = (patch: Partial<T>) => {
        const nextState = { ...stateRef.current, ...patch };
        stateRef.current = nextState;
        setState(nextState);

        startTransition(() => {
            router.replace(buildAdminListHref(pathname, nextState), { scroll: false });
        });
    };

    return {
        state,
        buildHref,
        updateState,
    };
}
