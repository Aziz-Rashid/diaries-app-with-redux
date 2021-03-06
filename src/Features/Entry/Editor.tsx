import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import Markdown from "markdown-to-jsx";
import http from "../../Services/api";
import { Entry } from "../../Interfaces/entry.interface";
import { Diary } from "../../Interfaces/diary.interface";
import { setCurrentlyEdit, setCanEdit } from "./editorSlice";
import { updateDiaries } from "../Diary/diariesSlice";
import { updateEntry } from "./entriesSlice";
import { showAlert } from "../../utils";
import { useAppDispatch } from "../../store";

const Editor: FC = () => {
  const { currentlyEditing: entry, canEdit, activeDiaryId } = useSelector(
    (state: RootState) => state.editor
  );
  const [editedEntry, updateEditedEntry] = useState(entry);
  const dispatch = useAppDispatch();

  const saveEntry = async () => {
    if (activeDiaryId == null) {
      return showAlert("Please select a diary.", "warning");
    }
    if (entry == null) {
      http
        .post<Entry, { diary: Diary; entry: Entry }>(
          `/diaries/entries/${activeDiaryId}`,
          editedEntry
        )
        .then((data) => {
          if (data != null) {
            const { diary, entry: _entry } = data;
            dispatch(setCurrentlyEdit(_entry));
            dispatch(updateDiaries(diary));
          }
        });
    } else {
      http
        .put<Entry, Entry>(`/diaries/entries/${entry.id}`, editedEntry)
        .then((_entry) => {
          if (_entry != null) {
            dispatch(setCurrentlyEdit(_entry));
            dispatch(updateEntry(_entry));
          }
        });
    }
    dispatch(setCanEdit(false));
  };

  useEffect(() => {
    updateEditedEntry(entry);
  }, [entry]);

  return (
    <div className="editorSection">
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "0.2em",
          paddingBottom: "0.2em",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {entry && !canEdit ? (
          <h4>
            {entry.title}
            <a
              href="#edit"
              onClick={(e) => {
                e.preventDefault();
                if (entry != null) {
                  dispatch(setCanEdit(true));
                }
              }}
            >
              (Edit)
            </a>
          </h4>
        ) : (
          <input
            value={editedEntry?.title ?? ""}
            disabled={!canEdit}
            placeholder="Title"
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  title: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: e.target.value,
                  content: "",
                });
              }
            }}
          />
        )}
      </header>
      {entry && !canEdit ? (
        <Markdown>{entry.content}</Markdown>
      ) : (
        <>
          <textarea
            disabled={!canEdit}
            placeholder="Supports markdown!"
            value={editedEntry?.content ?? ""}
            onChange={(e) => {
              if (editedEntry) {
                updateEditedEntry({
                  ...editedEntry,
                  content: e.target.value,
                });
              } else {
                updateEditedEntry({
                  title: "",
                  content: e.target.value,
                });
              }
            }}
          />
          <button className="Savebtn" onClick={saveEntry} disabled={!canEdit}>
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default Editor;
