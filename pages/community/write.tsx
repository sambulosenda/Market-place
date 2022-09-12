import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import useCoords from "@libs/client/useCoords";
import useMutation from "@libs/client/useMutation";
import { Post } from "@prisma/client";
import type { NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface WriteForm {
  question: string;
}

interface WriteResponse {
  ok: boolean;
  post: Post
}
const Write: NextPage = () => {
  const {latitude, longitude} =  useCoords()
  const router = useRouter()
  const {register, handleSubmit} =  useForm<WriteForm>()
  const [post, {loading, data}] = useMutation<WriteResponse>("/api/posts")
  const onValid = (data:WriteForm) => {
    if(loading) return;
    post({...data, latitude, longitude})

  }
  useEffect(() => {
    if(data && data.ok) {
      router.push(`/community/${data.post.id}`)
    }

  }, [data, router])
  return (
    <Layout canGoback title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea register={register("question", {required: true, minLength: 5})}  required placeholder="Ask a question!" />
        <Button text={loading ? "loading" : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
