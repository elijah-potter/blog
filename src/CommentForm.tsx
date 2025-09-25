import { useId } from "react";

export default function CommentForm({ post }: { post: string }) {
	const id = useId();

	return (
		<form
			action="/api/submitcomment"
			method="POST"
			className="mx-auto p-6 bg-white rounded-2xl space-y-4"
		>
			<input type="hidden" name="id" />

			<div className="flex flex-col">
				<label htmlFor={`${id}-post`} className="mb-1 font-extrabold">
					Comment
				</label>
				<input
					type="text"
					id={`${id}-post`}
					name="post"
					hidden
					value={post}
					readOnly
					required
					className="px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
				/>
			</div>

			<div className="flex flex-col">
				<label
					htmlFor={`${id}-name`}
					className="mb-1 font-medium text-gray-700"
				>
					Name
				</label>
				<input
					type="text"
					id={`${id}-name`}
					name="name"
					required
					className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
				/>
			</div>

			<div className="flex flex-col">
				<label
					htmlFor={`${id}-email`}
					className="mb-1 font-medium text-gray-700"
				>
					Email
				</label>
				<input
					type="email"
					id={`${id}-email`}
					name="email"
					required
					className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
				/>
			</div>

			<div className="flex flex-col">
				<label
					htmlFor={`${id}-message`}
					className="mb-1 font-medium text-gray-700"
				>
					Message
				</label>
				<textarea
					id={`${id}-message`}
					name="message"
					required
					rows={4}
					className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
				/>
			</div>

			<button type="submit" className="w-full text-black py-2 px-4">
				Submit
			</button>
		</form>
	);
}
