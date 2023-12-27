import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [notes, setNotes] = useState([]);
	const [currNote, setCurrNote] = useState("");

	useEffect(() => {
		const q = query(collection(db, "notes"));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const notes = [];

			querySnapshot.forEach((doc) => {
				notes.push({ ...doc.data(), id: doc.id });
			});

			setNotes(notes);

			console.log(notes);
		});

		return () => unsubscribe();
	}, []);

	async function addNote() {
		try {
			if (!currNote) {
				return alert("Please type something");
			} else {
				await addDoc(collection(db, "notes"), {
					description: currNote,
					timestamp: serverTimestamp(),
					likes: 0,
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function addLike(id, likeCount) {
		try {
			const noteRef = doc(db, "notes", id);

			await updateDoc(noteRef, {
				likes: likeCount + 1,
			});
		} catch (error) {
			console.log(error);
		}
  }
  
  async function deleteNote(id) {
		try {
			await deleteDoc(doc(db, "notes", id));
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<main className="px-4 flex flex-col gap-4">
			<header className="py-4 flex-row items-center ">
				<Link href="" className="">
					Joshua's Sticky Notes
				</Link>
			</header>
			<section>
				<textarea
					className="border w-full p-2"
					name=""
					id=""
					rows="5"
					placeholder="Put note here..."
					onChange={(e) => setCurrNote(e.target.value)}
				/>
				<button className="border px-2 py-1 bg-blue-100" onClick={addNote}>
					Add Note
				</button>
			</section>
			<section className="space-y-2">
				<h1>My sticky notes</h1>
				<div className="grid grid-cols-2 gap-2">
					{notes.map((value, index) => (
						<div key={index} className="border p-2 bg-yellow-100 space-y-3">
							<p>{value.description}</p>
							<div className="flex flex-row items-center gap-2">
								<button className="border px-4 py-1 bg-white rounded-full" onClick={() => addLike(value.id, value.likes)}>
									<span>{value.likes} Like</span>
								</button>
								<button className="border px-4 py-1 bg-white rounded-full" onClick={() => deleteNote(value.id)}>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
