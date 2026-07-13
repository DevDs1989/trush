# Output
Output demo.gif

# Terminal settings
Set FontSize 14
Set Width 1200
Set Height 600
Set Theme "Dracula"
Set Padding 20
Set TypingSpeed 50ms

# Seed fake data so stats and history look good
Hide
Enter
Sleep 500ms
Show

# Show the start command
Type "trush start"
Enter
Sleep 2s

# Navigate the picker - arrow down twice then select
Down
Down
Sleep 500ms
Enter
Sleep 1s

# Simulate working in editor - just sleep since editor cant open in VHS
Sleep 3s

# Exit Neovim
Escape
Type ":q!"
Enter
Sleep 1s

# Confirm completion
Type "y"
Enter
Sleep 2s
