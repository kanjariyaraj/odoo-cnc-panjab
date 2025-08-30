"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UseApiOptions {
  skip?: boolean;
  dependencies?: any[];
}

export function useApi<T>(endpoint: string, options: UseApiOptions = {}) {
  const { data: session } = useSession();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { skip = false, dependencies = [] } = options;

  const fetchData = async () => {
    if (skip || !session) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('API fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [session, endpoint, skip, ...dependencies]);

  return { data, loading, error, refetch };
}

export function useApiMutation<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const { method = 'POST', body, headers = {} } = options;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        return result;
      } else {
        // If response is not JSON, return empty object
        return {};
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('API mutation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}