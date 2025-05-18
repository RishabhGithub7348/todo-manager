import { RequestHandler } from 'express';
import { validateDataUsingJOI } from '../../utils/validator';
import { ReturnError, ReturnSuccess } from '../../models/request_response';
import { CreateNoteRequest } from '../../entities/note';
import { CreateNoteRequestSchema } from '../../entities/note';
import { NoteService } from '../../services/notes/notes_serv';


export const createNote: RequestHandler = async (req, res) => {
  const data = validateDataUsingJOI<CreateNoteRequest>(req.body, CreateNoteRequestSchema);
  if (data instanceof Error) {
    return ReturnError(res, [data.message], 400);
  }

  const note = await NoteService.createNote(data);
  if (note instanceof Error) {
    return ReturnError(res, [note.message], 400);
  }

  return ReturnSuccess(res, note);
};

export const getNotesByTodoPid: RequestHandler = async (req, res) => {
  const { pid } = req.params;

  const notes = await NoteService.getNotesByTodoPid(pid);
  if (notes instanceof Error) {
    return ReturnError(res, [notes.message], 404);
  }

  return ReturnSuccess(res, notes);
};