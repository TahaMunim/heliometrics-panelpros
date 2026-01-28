import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useSlides() {
  return useQuery({
    queryKey: [api.slides.list.path],
    queryFn: async () => {
      const res = await fetch(api.slides.list.path);
      if (!res.ok) throw new Error("Failed to fetch slides");
      const data = await res.json();
      return api.slides.list.responses[200].parse(data);
    },
  });
}
