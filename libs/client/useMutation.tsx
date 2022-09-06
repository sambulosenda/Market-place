import { useState } from "react";

interface useMutationState  <T> {
  loading: boolean;
  data?: T;
  error?: object;
}

type UseMutationResult <T> = [(data: any) => void, useMutationState<T>];
export default function useMutation<T = any>(url: string): UseMutationResult <T> {
  const [loading, setloading] = useState(false);
  const [data, setData] = useState<undefined | any>(undefined);
  const [error, setError] = useState<undefined | any>(undefined);
  function mutation(data: any) {
    setloading(true);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then(setData)
      .catch(setError)
      .finally(() => setloading(false))
  }
  return [mutation, { loading, data, error }];
}
