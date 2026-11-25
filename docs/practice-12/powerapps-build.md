# Practice #12 – Low-code solution in Power Apps (build guide)

## As built (25 Nov 2026)
App `SmartCampusChecker_LowCode`, Tablet format, environment KBTU (default). Studio ran in a Russian locale, so the real formulas use `;` between arguments and `;;` between actions (the guide below shows the English-locale form).
Actual control names: `Dropdown1` (room, Items `colRooms`, Value `Name`), `Label4` (room status text: Active / Blocked, used instead of a toggle), `TextInput1` (start), `TextInput2` (duration), `Button1` (OnSelect = workflow below with `TextInput1/2` and `Dropdown1`), `Label3` (decision + message + reason code, colored), `Label2` (bookings header with `CountRows(colBookings)`), `Gallery1` (`Title1` interval, `Subtitle1` minutes), `Label1` (title).
Not implemented: clearing the old result when an input changes (OnChange reset).


Canvas app, fictional data in local collections. No Dataverse, SharePoint, connectors, login or premium features.

> Formula separators: in English locale formulas use `,` between arguments and `;` between actions.
> If your Power Apps shows `;` as the argument separator (comma-decimal locale), use `;` instead of `,` and `;;` instead of `;`.

## 1. Create the app
make.powerapps.com -> Create -> Blank app -> Blank canvas app -> name `SmartCampusChecker`, format **Tablet**.
(Settings -> Display -> turn off "Scale to fit" only if you want to try a responsive layout; otherwise keep the default and note it as a limitation.)

## 2. Data – `App.OnStart`
```
Set(varNow, 540);
ClearCollect(colRooms,
    {Id: "room-a", Name: "Room A — Study Hall", Blocked: false},
    {Id: "room-b", Name: "Room B — Lab", Blocked: false},
    {Id: "room-c", Name: "Room C — Auditorium", Blocked: true},
    {Id: "room-d", Name: "Room D — Seminar Room", Blocked: false},
    {Id: "room-e", Name: "Room E — Workshop", Blocked: false}
);
ClearCollect(colBookings,
    {RoomId: "room-a", StartMin: 600, EndMin: 660},
    {RoomId: "room-c", StartMin: 480, EndMin: 540},
    {RoomId: "room-c", StartMin: 780, EndMin: 840},
    {RoomId: "room-d", StartMin: 660, EndMin: 720},
    {RoomId: "room-d", StartMin: 840, EndMin: 900},
    {RoomId: "room-e", StartMin: 600, EndMin: 720}
)
```
After pasting: tree view -> App -> "..." -> **Run OnStart**.

## 3. Controls (Insert menu, classic controls)
| Control | Name | Properties |
|---------|------|------------|
| Label | lblTitle | Text: `"Smart Campus – Room Availability (Power Apps)"` |
| Label | lblNow | Text: `"Current time: 09:00 (fixed)"` |
| Drop down | ddRoom | Items: `colRooms`; Value (field): `Name` |
| Toggle | tglBlocked | Default: `ddRoom.Selected.Blocked`; DisplayMode: `DisplayMode.View`; TrueText: `"Blocked"`; FalseText: `"Active"` |
| Text input | txtStart | Default: `""`; HintText: `"HH:MM"` |
| Text input | txtDuration | Default: `""`; HintText: `"Duration, minutes"`; Format: Text |
| Button | btnCheck | Text: `"Check availability"`; OnSelect: see step 4 |
| Label | lblDecision | Text: `If(IsBlank(varCode), "", If(varAvailable, "Available", "Unavailable"))`; Color: `If(varAvailable, Color.Green, Color.Red)`; FontWeight: Bold |
| Label | lblMessage | Text: `varMsg` |
| Label | lblCode | Text: `If(IsBlank(varCode), "", "Reason code: " & varCode)` |
| Blank vertical gallery | galBookings | Items: `Filter(colBookings, RoomId = ddRoom.Selected.Id)` |
| Label (inside gallery) | lblBooking | Text: `Text(RoundDown(ThisItem.StartMin / 60, 0), "00") & ":" & Text(Mod(ThisItem.StartMin, 60), "00") & " – " & Text(RoundDown(ThisItem.EndMin / 60, 0), "00") & ":" & Text(Mod(ThisItem.EndMin, 60), "00")` |
| Label | lblTotal | Text: `"Total bookings in data: " & CountRows(colBookings)` (evidence for T8) |

Clear an old result when an input changes – set **OnChange** of `ddRoom`, `txtStart` and `txtDuration` to:
```
Set(varCode, Blank()); Set(varMsg, "")
```

## 4. Workflow – `btnCheck.OnSelect`
```
Set(varStartText, Trim(txtStart.Text));
Set(varDurText, Trim(txtDuration.Text));
Set(varStartOk, IsMatch(varStartText, "([01][0-9]|2[0-3]):[0-5][0-9]"));
Set(varReqStart, If(varStartOk, Value(Left(varStartText, 2)) * 60 + Value(Right(varStartText, 2)), -1));
Set(varDurIsNumber, IsMatch(varDurText, "[0-9]+"));
Set(varReqDur, If(varDurIsNumber, Value(varDurText), -1));
Set(varReqEnd, varReqStart + varReqDur);
Set(varConflict, First(Filter(colBookings, RoomId = ddRoom.Selected.Id && varReqStart < EndMin && varReqEnd > StartMin)));
If(
    !varStartOk,
        Set(varCode, "INVALID_TIME"); Set(varMsg, "Start time must be in HH:MM format."),
    varReqStart <= varNow,
        Set(varCode, "PAST_TIME"); Set(varMsg, "Start time must be after the current time (09:00)."),
    !varDurIsNumber || varReqDur = 0,
        Set(varCode, "INVALID_DURATION"); Set(varMsg, "Duration must be a whole number of minutes greater than 0."),
    varReqDur > 120,
        Set(varCode, "TOO_LONG"); Set(varMsg, "Duration is " & varReqDur & " minutes, which exceeds the 120-minute limit."),
    varReqEnd > 1440,
        Set(varCode, "INVALID_TIME"); Set(varMsg, "The booking must end by 24:00."),
    ddRoom.Selected.Blocked,
        Set(varCode, "BLOCKED"); Set(varMsg, ddRoom.Selected.Name & " is currently blocked and unavailable for booking."),
    !IsBlank(varConflict),
        Set(varCode, "OVERLAP");
        Set(varMsg, "This interval overlaps an existing booking from " &
            Text(RoundDown(varConflict.StartMin / 60, 0), "00") & ":" & Text(Mod(varConflict.StartMin, 60), "00") & " to " &
            Text(RoundDown(varConflict.EndMin / 60, 0), "00") & ":" & Text(Mod(varConflict.EndMin, 60), "00") & "."),
    Set(varCode, "AVAILABLE");
    Set(varMsg, ddRoom.Selected.Name & " is available " &
        Text(RoundDown(varReqStart / 60, 0), "00") & ":" & Text(Mod(varReqStart, 60), "00") & "–" &
        Text(RoundDown(varReqEnd / 60, 0), "00") & ":" & Text(Mod(varReqEnd, 60), "00") & ".")
);
Set(varAvailable, varCode = "AVAILABLE")
```
The workflow only reads `colBookings` (no `Patch`, `Collect` or `Remove`), so AC5/T8 holds by construction; `lblTotal` shows 6 before and after the tests.

## 5. Run the tests
Preview (F5), run T1–T8 from `contract.md`, take a screenshot of each result. Fill `test-results.md`.

## 6. Save, publish, export
- File -> Save, then **Publish**. Publishing shares the app only inside your organization (no anonymous public link).
- Export for submission: File -> Save as -> **This computer** -> `.msapp` file, or Apps list -> "..." -> Export package.
- Version control: Power Apps keeps a version history (Apps -> "..." -> Details -> Versions); git integration needs a Dataverse environment and was not used.

## Things to record as limitations (if you meet them)
- No real unit tests: the T1–T8 checks are manual in Preview.
- Logic lives in one OnSelect formula; no diffable source code in this repo (only the exported `.msapp`).
- Layout: Tablet format scales but is not truly responsive unless "Scale to fit" is turned off and containers are used.
