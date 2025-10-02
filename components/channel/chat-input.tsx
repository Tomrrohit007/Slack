import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Id } from "@/convex/_generated/dataModel"
import { useCreateMessage } from "@/features/messages/api/use-create-message"
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url"
import { useChannelId } from "@/hooks/use-channel-id"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

const Editor = dynamic(() => import('./editor'), { ssr: false })


type SubmitValuesProps = {
  channelId: Id<"channels">,
  workspaceId: Id<"workspaces">,
  body: string;
  image: Id<"_storage"> | undefined
}


export const ChatInput = ({ placeholder }: { placeholder: string }) => {

  const [editorKey, setEditorKey] = useState(0)
  const [isPending, setIsPending] = useState(false)

  const channelId = useChannelId()
  const workspaceId = useWorkspaceId()

  const { mutate: createMessage } = useCreateMessage()
  const { mutate: generateUploadUrl } = useGenerateUploadUrl()

  async function handleSubmit({ body, image }: { body: string, image: File | null }
  ) {
    try {

      editorRef.current?.enable(false)
      setIsPending(true)

      const values: SubmitValuesProps = {
        channelId, workspaceId, body, image: undefined
      }
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true })
        if (!url) throw new Error("Url not found")

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-type": image.type },
          body: image
        })

        if (!result.ok) throw new Error("Failed to upload image")

        const { storageId } = await result.json()
        values.image = storageId
      }

      createMessage(values, { throwError: true })
      setEditorKey((key) => key + 1)
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsPending(false)
      editorRef.current?.enable(true)
    }
  }
  const editorRef = useRef<Quill | null>(null)
  return (

    <div className="w-full px-5">
      <Editor key={editorKey} variant="create" placeholder={placeholder} onSubmit={handleSubmit} disabled={isPending} innerRef={editorRef} />
    </div>
  )
}
