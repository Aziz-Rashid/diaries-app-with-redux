import { Request, Response } from "miragejs";
import { handleErrors } from "../server";
import { Diary } from "../../../Interfaces/diary.interface";
import { Entry } from "../../../Interfaces/entry.interface";
import dayjs from "dayjs";

export const addEntry = (
  schema: any,
  req: Request
): { diary: Diary; entry: Entry } | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>;
    const now = dayjs().format();
    const entry = diary.createEntry({
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });

    diary.update({
      ...diary.attrs,
      updatedAt: now,
    });

    return {
      diary: diary.attrs,
      entry: entry.attrs,
    };
  } catch (error) {
    return handleErrors(null, "Failed to add new Entry");
  }
};

export const getEntries = (schema: any, req: Request): Entry[] | Response => {
  try {
    const diary = schema.diaries.find(req.params.id);
    return diary.entry;
  } catch (error) {
    return handleErrors(null, "Failed to get Entries");
  }
};

export const updateEntries = (schema: any, req: Request): Entry | Response => {
  try {
    const entry = schema.entries.find(req.params.id);
    const data = JSON.parse(req.requestBody);

    const now = dayjs().format();

    entry.update({
      ...data,
      updatedAt: now,
    });

    return entry.attrs as Entry;
  } catch (error) {
    return handleErrors(null, "Failed to update Entry");
  }
};
