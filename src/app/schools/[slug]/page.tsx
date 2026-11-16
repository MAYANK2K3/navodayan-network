import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_JNV_SCHOOLS, getSchoolBySlug } from "@/lib/seed/seed-schools";
import SchoolDetailClient from "./SchoolDetailClient";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_JNV_SCHOOLS.slice(0, 50).map((school) => ({
    slug: school.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const school = getSchoolBySlug(params.slug);
  if (!school) {
    return {
      title: "JNV School Hub | The Navodayan Network",
      description: "Jawahar Navodaya Vidyalaya Campus Hub",
    };
  }

  return {
    title: `${school.school_name} Alumni & Campus Hub`,
    description: `Official campus hub for ${school.school_name}, ${school.district}, ${school.state}. Connect with batchmates, view time capsules, and network with verified alumni.`,
    openGraph: {
      title: `${school.school_name} Alumni & Campus Hub | The Navodayan Network`,
      description: `Official campus hub for ${school.school_name}, ${school.district}, ${school.state}.`,
    },
  };
}

export default function SchoolDetailPage({ params }: Props) {
  const school = getSchoolBySlug(params.slug);
  if (!school) {
    notFound();
  }

  return <SchoolDetailClient school={school} />;
}
