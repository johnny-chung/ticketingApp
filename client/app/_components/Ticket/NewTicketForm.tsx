"use client";
import { newTicket } from "@/app/_lib/actions";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";

function NewTicketForm({ session }: { session: string | undefined }) {
  return (
    <div>
      <form
        action={newTicket} //use server action in form action-> auto make api call etc.
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            required
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>
        <input hidden type="hidden" name="session" value={session} />
        <div className="flex justify-end items-center gap-6">
          <Button />
        </div>
      </form>
    </div>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {pending ? "Creating..." : "Create New Ticket"}
    </button>
  );
}

export default NewTicketForm;
