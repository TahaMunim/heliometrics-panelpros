import { slides, type Slide, type InsertSlide } from "@shared/schema";

export interface IStorage {
  getSlides(): Promise<Slide[]>;
}

export class MemStorage implements IStorage {
  async getSlides(): Promise<Slide[]> {
    // Return the 12 slides in order
    // Files are named 1.html, 2.html, ..., 12.html
    const slideList: Slide[] = [];
    for (let i = 1; i <= 12; i++) {
      slideList.push({
        id: i,
        title: `Slide ${i}`,
        url: `/slides/${i}.html`,
        order: i
      });
    }
    return slideList;
  }
}

export const storage = new MemStorage();
