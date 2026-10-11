# Project Architecture Rules

- Render the Tradelines marketplace inventory as a semantic, horizontally scrollable table because shoppers compare many numeric fields side by side.- AI tradeline recommendations run in the `recommend-tradelines` backend function, which only returns ids from the inventory the client sends, because the inventory is generated client-side and the AI key must stay server-side.
