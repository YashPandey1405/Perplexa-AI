"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/about");
  }, [router]);

  return null; // nothing to show on root, auto-redirects
}
