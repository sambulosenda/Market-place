import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useMutation from "@libs/client/useMutation";
import { Stream } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CreateStreamForm {
  name: string;
  price: string;
  description: string;
}

interface CreateLiveResponse {
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const [createStream, { loading, data }] =
    useMutation<CreateLiveResponse>(`/api/streams`);
  const router = useRouter();

  const { register, handleSubmit } = useForm<CreateStreamForm>();
  const onValid = (form: CreateStreamForm) => {
    if (loading) return;

    createStream(form);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoback title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          required
          label="Name"
          name="name"
          type="text"
          register={register("name", { required: true })}
        />
        <Input
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
          register={register("price", { required: true, valueAsNumber: true })}
        />
        <TextArea
          name="description"
          label="Description"
          register={register("description", { required: true })}
        />
        <Button text={loading ? "loading" : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;
