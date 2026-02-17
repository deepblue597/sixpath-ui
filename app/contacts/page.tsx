"use client";

import PersonCard from "../components/contacts/personCard";
import PersonData from "../../personsData.js";
import { useRouter } from "next/navigation";

export default function ContactsPage() {
  const router = useRouter();
  return (
    <PersonCard
      people={PersonData}
      onClick={(person) => router.push(`/contacts/${person.id}/edit`)}
    />
  );
}
