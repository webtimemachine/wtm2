"use client"

import { Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-5 gap-5">
      <h1 className="text-3xl">Hello world 🌎</h1>
      <Button onClick={()=>{
        alert('AAAAAAAA')
      }}>Test</Button>
    </div>
  );
}
