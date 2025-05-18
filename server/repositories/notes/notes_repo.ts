import { NoteModel, INote, CreateNoteRequest } from '../../entities/note';
import oplog from "../../oplog/oplog";
import { getErrorMessage } from "../../oplog/error";

export async function create(data: CreateNoteRequest): Promise<INote | Error> {
  try {
    const note = new NoteModel(data);
    const savedNote = await note.save();
    return savedNote;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function findByTodoPid(todoPid: string): Promise<INote[] | Error> {
  try {
    const notes = await NoteModel.find({ todoPid }).exec();
    return notes;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function deleteByTodoPid(todoPid: string): Promise<void | Error> {
  try {
    await NoteModel.deleteMany({ todoPid }).exec();
    return;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export const NoteRepository = {
  create,
  findByTodoPid,
  deleteByTodoPid,
};