"use client";

import Link from "next/link";
import { useClass } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentPick() {
  const { students } = useClass();

  return (
    <div className="container mx-auto grid gap-4 p-6 md:grid-cols-3">
      {students.map((student) => (
        <Link key={student.id} href={`/student/${student.id}`}>
          <Card className="transition hover:shadow-md">
            <CardHeader>
              <CardTitle>{student.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {student.language === "bilingual" ? "EN/ES" : "EN"}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
