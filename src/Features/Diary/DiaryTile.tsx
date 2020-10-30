import React, { FC, useState } from "react";
import { Diary } from "../../Interfaces/diary.interface";
import http from "../../Services/api";
import { updateDiaries } from "./diariesSlice";
import {
  setCanEdit,
  setActiveDiaryId,
  setCurrentlyEdit,
} from "../Entry/editorSlice";
import { showAlert } from "../../utils";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../store";

interface Props {
  diary: Diary;
}

const DiaryTile: FC<Props> = (props) => {
  const [diary, setDiary] = useState(props.diary);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();
  const totalEntries = props.diary?.entryIDs?.length;

  const saveChanges = async () => {
    http
      .put<Diary, Diary>(`/diaries/${diary.id}`, diary)
      .then((diary) => {
        if (diary) {
          dispatch(updateDiaries(diary));
          showAlert("Saved!", "success");
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsEditing(false);
      });
  };

  return (
    <div className="diary_tile">
      <h2
        className="title"
        title="Click to edit"
        onClick={() => setIsEditing(true)}
        style={{
          cursor: "pointer",
        }}
      >
        {isEditing ? (
          <input
            value={diary.title}
            onChange={(e) => {
              setDiary({
                ...diary,
                title: e.target.value,
              });
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                saveChanges();
              }
            }}
          />
        ) : (
          <span>{diary.title}</span>
        )}
      </h2>
      <p className="subtitle">{totalEntries ?? "0"} saved entries</p>
      <div className="diary_tileBtns">
        <button
          className="btnSize"
          onClick={() => {
            dispatch(setCanEdit(true));
            dispatch(setActiveDiaryId(diary.id as string));
            dispatch(setCurrentlyEdit(null));
          }}
        >
          Add New Entry
        </button>
        <Link to={`diary/${diary.id}`} style={{ width: "100%" }}>
          <button className="btnSize">View all →</button>
        </Link>
      </div>
    </div>
  );
};

export default DiaryTile;
