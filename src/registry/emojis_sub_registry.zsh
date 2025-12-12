#!/usr/bin/env zsh
# 😊 EMOJIS SUB-REGISTRY
# AI-powered emoji intelligence and context-aware emoji system
# ════════════════════════════════════════════════════════════════════════

typeset -gA EMOJI_SETS
typeset -gA EMOJI_CONTEXT_MAP
typeset -gA EMOJI_SCORES
typeset -gA EMOJI_AI_INTELLIGENCE

# ════════════════════════════════════════════════════════════════════════
# 🎯 EMOJI CATEGORY REGISTRATION
# ════════════════════════════════════════════════════════════════════════

register_emoji_set() {
    local id="$1"
    local category="$2"
    local description="$3"
    local context_tags="$4"
    shift 4
    local emojis=("$@")
    
    EMOJI_SETS[$id]=$(cat <<-EOF
{
  "id": "$id",
  "category": "$category",
  "description": "$description",
  "tags": "$context_tags",
  "emojis": [$(printf '"%s", ' "${emojis[@]}" | sed 's/, $//')],
  "count": ${#emojis[@]},
  "registered": "$(date -Iseconds)"
}
EOF
)
}

# ════════════════════════════════════════════════════════════════════════
# 🎨 COMPREHENSIVE EMOJI DATABASE
# ════════════════════════════════════════════════════════════════════════

load_emoji_database() {
    
    # ────────────────────────────────────────────────────────────────────
    # SUCCESS & COMPLETION EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_success" \
        "Success & Achievement" \
        "Emojis for successful operations and achievements" \
        "success,complete,victory,achieved,done,passed" \
        "✨" "🌟" "🎯" "✅" "🔥" "🚀" "⚡" "💫" "⭐" "🌠" \
        "🏆" "🥇" "🎖️" "👑" "💎" "🎊" "🎉" "🥳" "💯" "🙌"
    
    register_emoji_set \
        "emojis_celebration" \
        "Celebrations & Victories" \
        "Festive emojis for celebrating milestones" \
        "celebration,party,festive,joy,victory" \
        "🎉" "🎊" "🥳" "🎈" "🎆" "🎇" "✨" "🌟" "🎁" "🍾" \
        "🏅" "🎖️" "👏" "🙌" "💃" "🕺" "🎭" "🎪" "🎨" "🎬"
    
    # ────────────────────────────────────────────────────────────────────
    # ERROR & WARNING EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_error" \
        "Errors & Issues" \
        "Critical error and failure indicators" \
        "error,fail,critical,alert,stop,denied" \
        "❌" "💥" "🚨" "⛔" "🛑" "🔞" "☠️" "💀" "⚠️" "🔴" \
        "❗" "❌" "🚫" "🚷" "🆘" "📛" "🔴" "⏹️" "🪦" "💣"
    
    register_emoji_set \
        "emojis_warning" \
        "Warnings & Cautions" \
        "Warning and attention-grabbing emojis" \
        "warning,alert,caution,danger,attention" \
        "⚠️" "🔶" "🟠" "🌀" "🌪️" "🌩️" "⚡" "🔔" "📢" "🎪" \
        "💢" "💯" "🔥" "🚩" "📍" "🎗️" "🚧" "⏸️" "🔰" "♨️"
    
    # ────────────────────────────────────────────────────────────────────
    # INFORMATION & STATUS EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_info" \
        "Information & Status" \
        "Informational and status indicator emojis" \
        "info,status,update,notification,detail" \
        "💡" "🔍" "📊" "🎮" "🔮" "🎭" "🎨" "📈" "🔬" "🎪" \
        "ℹ️" "📝" "📋" "📄" "📃" "📑" "📰" "📢" "📣" "📡"
    
    register_emoji_set \
        "emojis_status" \
        "Status Indicators" \
        "Real-time status and progress indicators" \
        "status,active,inactive,pending,busy" \
        "🟢" "🟡" "🔴" "⚪" "🟣" "🟤" "⬛" "⬜" "◽" "◾" \
        "🔘" "📍" "🚩" "🏁" "✔️" "✖️" "❕" "❔" "⁉️" "🔅"
    
    # ────────────────────────────────────────────────────────────────────
    # LOADING & PROCESSING EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_loading" \
        "Loading & Processing" \
        "Spinners and processing state indicators" \
        "loading,processing,busy,working,thinking" \
        "🔄" "🌀" "🎡" "🎠" "🎢" "⚙️" "🔧" "🛠️" "⚗️" "🧪" \
        "🔩" "⚙️" "🔨" "🪛" "🧬" "⏳" "⏱️" "⏰" "🕐" "🕑"
    
    register_emoji_set \
        "emojis_spinner" \
        "Animated Spinners" \
        "Specific spinner/rotation emojis" \
        "spinner,rotate,turn,spin,circular" \
        "⠀" "⠁" "⠂" "⠄" "⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏"
    
    # ────────────────────────────────────────────────────────────────────
    # DOWNLOAD & TRANSFER EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_download" \
        "Downloads & Transfers" \
        "Download, upload, and file transfer emojis" \
        "download,upload,transfer,data,file,network" \
        "📥" "📤" "⬇️" "⬆️" "↩️" "↪️" "🔽" "🔼" "↕️" "↔️" \
        "🌐" "📡" "🔌" "🔋" "⚡" "💾" "💿" "📀" "🗂️" "📂"
    
    register_emoji_set \
        "emojis_network" \
        "Network & Connection" \
        "Network and connectivity indicators" \
        "network,connection,online,offline,signal" \
        "📡" "🛰️" "📶" "📳" "📴" "🔗" "🌐" "🌍" "🌎" "🌏" \
        "📞" "☎️" "📠" "📧" "💬" "💭" "🗨️" "🗯️" "💡" "🔆"
    
    # ────────────────────────────────────────────────────────────────────
    # PERFORMANCE & SPEED EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_speed" \
        "Speed & Performance" \
        "Fast, slow, and speed indicators" \
        "speed,fast,slow,performance,efficiency" \
        "🚀" "⚡" "💨" "🔥" "⏱️" "🏃" "🏃‍♀️" "🏃‍♂️" "💨" "🌪️" \
        "🏎️" "🚗" "✈️" "🛫" "🛬" "🏅" "⏬" "⏫" "⏭️" "⏮️"
    
    # ────────────────────────────────────────────────────────────────────
    # SECURITY & PROTECTION EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_security" \
        "Security & Protection" \
        "Security, encryption, and protection indicators" \
        "security,protect,safe,lock,encrypt,verified" \
        "🔒" "🔐" "🔑" "🗝️" "🛡️" "⚔️" "🔓" "🔓" "🔏" "🔐" \
        "✅" "☑️" "✔️" "✓️" "🆗" "🅰️" "🆑" "🆒" "🆓" "🆔"
    
    register_emoji_set \
        "emojis_verified" \
        "Verified & Approved" \
        "Checkmarks and approval indicators" \
        "verified,approved,correct,valid,passed" \
        "✅" "✔️" "☑️" "👍" "👌" "🆗" "✓️" "💯" "🎯" "✨" \
        "🌟" "⭐" "🏆" "🥇" "🎖️" "🎗️" "👑" "💎" "📍" "🚩"
    
    # ────────────────────────────────────────────────────────────────────
    # DATA & STATISTICS EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_data" \
        "Data & Analytics" \
        "Charts, graphs, and statistics emojis" \
        "data,statistics,analysis,chart,graph,metrics" \
        "📊" "📈" "📉" "💹" "💱" "💲" "💰" "💸" "💵" "💴" \
        "💶" "💷" "🧮" "📐" "📏" "⚖️" "🎯" "🎲" "🃏" "🎰"
    
    register_emoji_set \
        "emojis_metrics" \
        "Metrics & Measurements" \
        "Numerical and measurement indicators" \
        "metrics,measurement,count,number,value" \
        "0️⃣" "1️⃣" "2️⃣" "3️⃣" "4️⃣" "5️⃣" "6️⃣" "7️⃣" "8️⃣" "9️⃣" \
        "🔟" "💯" "🔢" "📊" "📈" "📉" "⏲️" "⏱️" "🎯" "🔔"
    
    # ────────────────────────────────────────────────────────────────────
    # TIME & DURATION EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_timing" \
        "Timing & Duration" \
        "Time-related and duration indicators" \
        "time,duration,eta,countdown,clock,seconds" \
        "⏱️" "⏰" "⏳" "⌛" "🕐" "🕑" "🕒" "🕓" "🕔" "🕕" \
        "🕖" "🕗" "🕘" "🕙" "🕚" "🕛" "⌚" "📅" "📆" "⏰"
    
    # ────────────────────────────────────────────────────────────────────
    # INTENSITY & HEAT EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_intensity" \
        "Intensity Levels" \
        "Heat, intensity, and level indicators" \
        "intensity,heat,cold,level,strength,power" \
        "🔥" "❄️" "❄" "🌡️" "☀️" "🌤️" "⛅" "🌥️" "☁️" "⛈️" \
        "🌧️" "🌨️" "💨" "🌪️" "🌀" "⚡" "☄️" "💫" "✨" "💥"
    
    # ────────────────────────────────────────────────────────────────────
    # CAPACITY & SIZE EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_capacity" \
        "Capacity & Size" \
        "Storage, size, and capacity indicators" \
        "capacity,storage,size,memory,space,full" \
        "💾" "💿" "📀" "🖥️" "🖨️" "⌨️" "🖱️" "🖲️" "🗄️" "📦" \
        "🎁" "🏠" "🏢" "🏬" "🏭" "🏗️" "📐" "📏" "⚖️" "🧰"
    
    # ────────────────────────────────────────────────────────────────────
    # SYSTEM & TECH EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_system" \
        "System & Technology" \
        "System components and technology emojis" \
        "system,tech,computer,device,hardware,software" \
        "💻" "🖥️" "⌨️" "🖱️" "🖨️" "🖲️" "📱" "📲" "☎️" "📞" \
        "📟" "📠" "🎙️" "🎚️" "🎛️" "🧭" "⚙️" "🔧" "🔨" "⚒️"
    
    # ────────────────────────────────────────────────────────────────────
    # EXPERIENCE & FEEL EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_mood" \
        "Mood & Feeling" \
        "Emotional and mood indicators" \
        "mood,feeling,emotion,happy,sad,neutral" \
        "😀" "😃" "😄" "😁" "😆" "😅" "🤣" "😂" "🙂" "🙃" \
        "😉" "😊" "😇" "🥰" "😍" "🤩" "😘" "😗" "😚" "😙"
    
    # ────────────────────────────────────────────────────────────────────
    # ATTENTION & ACTION EMOJIS
    # ────────────────────────────────────────────────────────────────────
    
    register_emoji_set \
        "emojis_action" \
        "Action & Attention" \
        "Action items and attention-grabbing emojis" \
        "action,attention,important,critical,urgent" \
        "👉" "👈" "👆" "👇" "☝️" "✍️" "🤚" "🤙" "🤛" "🤜" \
        "👊" "✊" "🤝" "🙏" "💅" "👋" "🤲" "🤷" "🤜" "💪"
}

# ════════════════════════════════════════════════════════════════════════
# 🧠 EMOJI AI INTELLIGENCE SYSTEM
# ════════════════════════════════════════════════════════════════════════

build_emoji_ai() {
    # Context keywords to emoji set mappings
    local -A context_map=(
        [success]="emojis_success,emojis_celebration,emojis_verified"
        [error]="emojis_error,emojis_warning,emojis_status"
        [loading]="emojis_loading,emojis_spinner,emojis_processing"
        [download]="emojis_download,emojis_network,emojis_speed"
        [network]="emojis_network,emojis_connection,emojis_signal"
        [security]="emojis_security,emojis_verified,emojis_protection"
        [performance]="emojis_speed,emojis_intensity,emojis_metrics"
        [data]="emojis_data,emojis_metrics,emojis_statistics"
        [time]="emojis_timing,emojis_duration,emojis_progress"
        [system]="emojis_system,emojis_tech,emojis_device"
        [mood]="emojis_mood,emojis_feeling,emojis_emotion"
        [action]="emojis_action,emojis_attention,emojis_urgent"
    )
    
    for context in ${(k)context_map[@]}; do
        EMOJI_CONTEXT_MAP[$context]="${context_map[$context]}"
    done
}

get_emoji_for_context() {
    local context="$1"
    local fallback="${2:-🎯}"
    
    # Build context list
    local context_sets="${EMOJI_CONTEXT_MAP[$context]}"
    
    if [[ -z "$context_sets" ]]; then
        echo "$fallback"
        return
    fi
    
    # Pick random emoji from appropriate set
    IFS=',' read -r -a sets <<< "$context_sets"
    local chosen_set="${sets[$((RANDOM % ${#sets[@]}))]}"
    
    local set_data="${EMOJI_SETS[$chosen_set]}"
    if [[ -n "$set_data" ]]; then
        local emojis=$(echo "$set_data" | grep -o '"emojis": \[[^]]*\]' | sed 's/.*\[//;s/\].*//' | tr ',' '\n' | tr -d ' "')
        local emoji_count=$(echo "$emojis" | wc -l)
        local selected_emoji=$(echo "$emojis" | sed -n "$((RANDOM % emoji_count + 1))p")
        
        if [[ -n "$selected_emoji" ]]; then
            echo "$selected_emoji"
            return
        fi
    fi
    
    echo "$fallback"
}

# ════════════════════════════════════════════════════════════════════════
# 🎯 EMOJI SCORING
# ════════════════════════════════════════════════════════════════════════

calculate_emoji_score() {
    local set_id="$1"
    local set_data="${EMOJI_SETS[$set_id]}"
    
    local count=$(echo "$set_data" | grep -o '"count": [0-9]*' | grep -o '[0-9]*')
    local category=$(echo "$set_data" | grep -o '"category": "[^"]*"' | cut -d'"' -f4)
    
    # Scoring dimensions
    local diversity=0
    local context_relevance=0
    local coverage=0
    local universality=0
    
    # 1️⃣ DIVERSITY (number of emojis in set)
    if (( count >= 20 )); then
        diversity=100
    elif (( count >= 15 )); then
        diversity=85
    elif (( count >= 10 )); then
        diversity=70
    else
        diversity=50
    fi
    
    # 2️⃣ CONTEXT RELEVANCE
    case "$category" in
        "Success & Achievement"|"Celebrations & Victories") context_relevance=95 ;;
        "Errors & Issues"|"Warnings & Cautions") context_relevance=90 ;;
        "Downloads & Transfers"|"Network & Connection") context_relevance=85 ;;
        "Loading & Processing") context_relevance=80 ;;
        "Security & Protection") context_relevance=90 ;;
        "Data & Analytics") context_relevance=85 ;;
        *) context_relevance=70 ;;
    esac
    
    # 3️⃣ COVERAGE (how well it covers use cases)
    coverage=75
    
    # 4️⃣ UNIVERSALITY (recognizable across cultures)
    universality=85
    
    # Final Emoji Score
    local score=$(( 
        (diversity * 30 + 
         context_relevance * 35 + 
         coverage * 20 + 
         universality * 15) / 100
    ))
    
    EMOJI_SCORES[$set_id]="$(cat <<-EOF
{
  "emoji_score": $score,
  "diversity": $diversity,
  "context_relevance": $context_relevance,
  "coverage": $coverage,
  "universality": $universality
}
EOF
)"
    
    return $score
}

# ════════════════════════════════════════════════════════════════════════
# 🔍 EMOJI QUERIES
# ════════════════════════════════════════════════════════════════════════

list_emoji_sets() {
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║              😊 EMOJI REGISTRY                                ║"
    echo -e "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    
    for set_id in ${(k)EMOJI_SETS}; do
        local set_data="${EMOJI_SETS[$set_id]}"
        local score_data="${EMOJI_SCORES[$set_id]}"
        
        local category=$(echo "$set_data" | grep -o '"category": "[^"]*"' | cut -d'"' -f4)
        local count=$(echo "$set_data" | grep -o '"count": [0-9]*' | grep -o '[0-9]*')
        local score=$(echo "$score_data" | grep -o '"emoji_score": [0-9]*' | grep -o '[0-9]*' 2>/dev/null || echo "N/A")
        
        printf "  %-30s [%2d emojis] Score: %s\n" "$category" "$count" "$score"
    done
    
    echo ""
}

show_emoji_set() {
    local set_id="$1"
    local set_data="${EMOJI_SETS[$set_id]}"
    
    if [[ -z "$set_data" ]]; then
        echo "❌ Emoji set '$set_id' not found"
        return 1
    fi
    
    local category=$(echo "$set_data" | grep -o '"category": "[^"]*"' | cut -d'"' -f4)
    local description=$(echo "$set_data" | grep -o '"description": "[^"]*"' | cut -d'"' -f4)
    local emojis=$(echo "$set_data" | grep -o '"emojis": \[[^]]*\]' | sed 's/.*\[//;s/\]//' | tr ',' ' ' | tr -d '"')
    
    echo -e "\n╔════════════════════════════════════════════════════════════════╗"
    echo -e "║            😊 $category"
    echo -e "╠════════════════════════════════════════════════════════════════╣"
    echo -e "║ $description"
    echo -e "╠════════════════════════════════════════════════════════════════╣"
    echo -e "║ Emojis:"
    echo -e "║"
    echo -ne "║  "
    for emoji in $emojis; do
        echo -ne "$emoji "
    done
    echo -e ""
    echo -e "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

# ════════════════════════════════════════════════════════════════════════
# 🚀 INITIALIZATION
# ════════════════════════════════════════════════════════════════════════

load_emoji_database
build_emoji_ai

# Calculate scores
for set_id in ${(k)EMOJI_SETS}; do
    calculate_emoji_score "$set_id" >/dev/null
done

echo "✅ Emoji Sub-Registry loaded with ${#EMOJI_SETS} sets (${#EMOJI_CONTEXT_MAP} context mappings)" >&2
return 0
