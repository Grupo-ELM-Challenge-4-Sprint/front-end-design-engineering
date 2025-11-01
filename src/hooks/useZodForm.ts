import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useZodForm<T extends z.ZodSchema>(schema: T) {
  type FormData = z.infer<T>;

  const getInitialData = useCallback((): Partial<FormData> => {
    try {
      if (schema instanceof z.ZodObject) {
        const shape = schema.shape;
        const initial: Partial<FormData> = {};
        Object.keys(shape).forEach(key => {
          initial[key as keyof FormData] = '' as unknown as FormData[keyof FormData];
        });
        return initial;
      }
    } catch (e) {
      console.error('Erro ao obter dados iniciais do schema:', e);
    }
    return {};
  }, [schema]);

  const [data, setData] = useState<Partial<FormData>>(getInitialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [errors]);

  const validate = useCallback((formData: Partial<FormData>): formData is FormData => {
    try {
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof FormData, string>> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as keyof FormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  }, [schema]);

  const reset = useCallback(() => {
    setData(getInitialData());
    setErrors({});
    setIsSubmitting(false);
  }, [getInitialData]);

  const handleSubmit = useCallback(async (onSubmit: (data: FormData) => Promise<void> | void) => {
    if (validate(data)) {
      setIsSubmitting(true);
      try {
        await onSubmit(data as FormData);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, data]);

  return {
    data: data as FormData,
    errors,
    isSubmitting,
    setValue,
    validate,
    reset,
    handleSubmit,
  };
}