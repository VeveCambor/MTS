"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import {
  createNote,
  deleteNote,
  getNotesForUser,
  updateNote,
} from "@/lib/services/training-diary";
import type { TrainingDiaryNote } from "@/types/domain";
import type { TablesInsert } from "@/types/database";

export function useTrainingDiary(userId: string | undefined) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const key = queryKeys.diaryNotes(userId ?? "none");

  const list = useQuery({
    queryKey: key,
    queryFn: () => getNotesForUser(supabase, userId!),
    enabled: Boolean(userId),
  });

  const byActivity = useMemo(() => {
    const map = new Map<string, TrainingDiaryNote>();
    for (const note of list.data ?? []) map.set(note.assign_activity_id, note);
    return map;
  }, [list.data]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const create = useMutation({
    mutationFn: (input: TablesInsert<"training_diary_notes">) => createNote(supabase, input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => updateNote(supabase, id, note),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteNote(supabase, id),
    onSuccess: invalidate,
  });

  return { ...list, byActivity, create, update, remove };
}
