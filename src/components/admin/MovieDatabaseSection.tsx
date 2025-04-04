
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PopulateMoviesButton } from "./PopulateMoviesButton";

export const MovieDatabaseSection = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Movie Database</CardTitle>
        <CardDescription>
          Manage the movie database and populate it with movies from 1990 to present
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PopulateMoviesButton />
      </CardContent>
    </Card>
  );
};
