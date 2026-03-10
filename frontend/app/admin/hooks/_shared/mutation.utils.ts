"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

export type ApiFailure = {
    statusCode?: number | string;
    error?: unknown;
    message?: string;
};

type FormField<T extends FieldValues> = Path<T> | "root";

type ErrorRule<T extends FieldValues> = {
    pattern: RegExp;
    field: FormField<T>;
};

type FormErrorOptions<T extends FieldValues> = {
    fallbackMessage: string;
    fieldMap?: Record<string, FormField<T>>;
    messageRules?: ErrorRule<T>[];
};

export const assertApiSuccess = <T>(response: T): T => {
    const apiError = response as ApiFailure;
    const statusCode = Number(apiError?.statusCode ?? 200);

    if (statusCode >= 400 || apiError?.error) {
        throw response;
    }

    return response;
};

export const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
    const apiError = error as ApiFailure;

    if (typeof apiError?.error === "string" && apiError.error.trim()) {
        return apiError.error;
    }

    if (typeof apiError?.message === "string" && apiError.message.trim()) {
        return apiError.message;
    }

    return fallbackMessage;
};

export const applyFormMutationError = <T extends FieldValues>(
    form: UseFormReturn<T>,
    error: unknown,
    options: FormErrorOptions<T>
) => {
    const { fallbackMessage, fieldMap = {}, messageRules = [] } = options;
    const apiError = (error as ApiFailure)?.error;

    if (apiError && typeof apiError === "object" && !Array.isArray(apiError)) {
        for (const [key, value] of Object.entries(apiError)) {
            const targetField = fieldMap[key] ?? "root";
            form.setError(targetField as FormField<T>, {
                type: "server",
                message: String(value),
            });
        }
        return;
    }

    const message = getApiErrorMessage(error, fallbackMessage);
    const matchedRule = messageRules.find((rule) => rule.pattern.test(message));
    const targetField = matchedRule?.field ?? "root";

    form.setError(targetField as FormField<T>, {
        type: "server",
        message,
    });
};

export const useDeleteWithRefresh = <TId>(
    mutationFn: (id: TId) => Promise<unknown>,
    successMessage?: string
) => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (id: TId) => {
            const response = await mutationFn(id);
            return assertApiSuccess(response);
        },
        onSuccess: () => {
            router.refresh();
            if (successMessage) {
                toast.success(successMessage);
            }
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error, "Thao tac that bai"));
        },
    });
};
