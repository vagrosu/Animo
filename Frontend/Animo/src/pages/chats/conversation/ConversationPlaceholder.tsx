export default function ConversationPlaceholder() {
  return (
    <div className={"w-full flex flex-col items-center justify-center bg-neutral-50"}>
      <i className={"fa-fw fa-regular fa-comments text-gray-400 text-8xl"} />
      <p
        className={"text-gray-400 text-lg mt-4"}
      >Start a new conversation or select an existing one.</p>
    </div>
  )
}