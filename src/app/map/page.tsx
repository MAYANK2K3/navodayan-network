import React from "react";
import type { Metadata } from "next";
import MapClient from "./MapClient";

export const metadata: Metadata = {
  title: "Navodayan Diaspora Map | Live Global City Clusters",
  description:
    "Interactive OpenStreetMap visualization of Jawahar Navodaya Vidyalaya alumni and students living across Indian metros and global diaspora hubs. Connect with local batchmates.",
};

export default function MapPage() {
  return <MapClient />;
}
