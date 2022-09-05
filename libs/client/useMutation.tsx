import { useState } from "react";

interface useMutationState {
  loading: boolean;
  data?: object;
  error?: object;
}

type UseMutationResult = [(data: any) => void, useMutationState];
export default function useMutation(url: string): UseMutationResult {
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
