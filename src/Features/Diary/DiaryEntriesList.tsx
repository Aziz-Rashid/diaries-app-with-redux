import React, { FC, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../rootReducer";
import http from "../../Services/api";
import { Entry } from "../../Interfaces/entry.interface";
import { setEntries } from "../Entry/entriesSlice";
import { setCurrentlyEdit, setCanEdit } from "../Entry/editorSlice";
import dayjs from "dayjs";
import { useAppDispatch } from "../../store";

const DiaryEntriesList: FC = () => {
  const { entries } = useSelector((state: RootState) => state);
  const dispatch = useAppDispatch();
  const { id }: any = useParams();

  useEffect(() => {
    if (id != null) {
      http
        .get<null, { entries: Entry[] }>(`/diaries/entries/${id}`)
        .then(({ entries: _entries }) => {
          if (_entries) {
            const sortByLastUpdated = _entries.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(setEntries(sortByLastUpdated));
          }
        });
    }
  }, [id, dispatch]);

  return (
    <div className="entries">
      <header>
        <Link to="/">
          <h3>← Go Back</h3>
        </Link>
      </header>
      <ul>
        {entries.map((entry) => (
          <li
            key={entry.id}
            onClick={() => {
              dispatch(setCurrentlyEdit(entry));
              dispatch(setCanEdit(true));
            }}
          >
            <h2 className="diariesList">{entry.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryEntriesList;
