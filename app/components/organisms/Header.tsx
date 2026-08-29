import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="">
      <Button variant={"ghost"} onClick={() => navigate(-1)}>
        <ChevronLeft />
      </Button>
    </header>
  );
}
