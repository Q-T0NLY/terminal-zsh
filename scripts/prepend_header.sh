#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HEADER=$(cat <<'HEADER'
# 🚀  HEADER MATRIX                                                    
         ╭══════════════════════════════════════════════════════════════════════╮      
         ║  ██████╗  ██████╗ ███╗   ██╗███████╗██████╗ ███████╗ █████╗ ██╗      ║      
         ║  ██╔══██╗██╔═══██╗████╗  ██║██╔════╝██╔══██╗██╔════╝██╔══██╗██║      ║      
         ║  ██║  ██║██║   ██║██╔██╗ ██║█████╗  ██║  ██║█████╗  ███████║██║      ║      
         ║  ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ██║  ██║██╔══╝  ██╔══██║██║      ║      
         ║  ██████╔╝╚██████╔╝██║ ╚████║███████╗██████╔╝███████╗██║  ██║███████╗ ║      
         ║  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝ ║      
         ╰══════════════════════════════════════════════════════════════════════╯                                                     
    # [🧠] SYSTEM: NEXUS PRO AI STUDIO  [🏛️] ARCHITECT: ULTIMATE HYPER-v∞.0
    # [📂] FILE: [filename]                                [📍] PATH: [path/to/file]                                
    # [📅] CREATED: [YYYY-MM-DD]             [🏷️] VERSION: [1.0.0]                                
    # [🧱] PART: [1/X] (Multi-File Split Supported)                                   
    # [🎨] THEME: [Dynamic]                           [🔮] ENGINE: TRANSFORMER X + UCE + NEUROMORPHIC  + CNN + Temporal + Fusion         
    # [⚡] PERFORMANCE: <1ms core latency | <10ms network | <50ms end-to-end                                      
    # [🛡️] SECURITY: Military-Grade AES-256-GCM | Zero-Trust | Post-Quantum Crypto Ready                         
    # [🐳] CONTAINER: [Atomic Docker Container] | [Standalone Mode] | [Multi-Arch Build]                               
║─────────────────────────────────────────────  
    # [⚡]INJECTION CAPABILITIES:     ║─────────────────────────────────────────────                                                 
    # [💉] Micro-services          [🧬] Self-Evolution     [🧠] Generative Optimization     
    # [🐜] Swarm Intelligence    [🏗️] Hyper-Registry    [🔌] Dynamic Plugins       
    # [🌌] 4D Holographics       [🎨] Gen-UI 3.0           [💬] Hyper-Meta Chatbot           
    # [🧩] Visual Plugin Builder [🔄] Auot-Registry Integration                     
    # [🕸️] Graph Intelligence     [📊] Dynamic Scoring [📡] Auto-Management       
    # [🗣️] Context/NLP Fusion  [⚖️] Multi-Model Consensus                        
    # [🐳] Atomic Containerization                               [⚡] High-Frequency Integration              
    # [🤖] Agent Factory            [🌐] Deep Crawling   [🎭] Adaptive UI   
    # [🌀] Quantum Computing Sim                            [🧪] Experimental Features
    # [🔮] Predictive Analytics                                     [🏢] Enterprise Systems                                                                                     
║─────────────────────────────────────────────
HEADER
)

# find files
mapfile -t files < <(find "$ROOT" -type f -not -path '*/.git/*' -not -path "$ROOT/scripts/prepend_header.sh")

for f in "${files[@]}"; do
  # skip binary files (simple heuristic)
  if head -c 800 "$f" | grep -q '\\x00'; then
    continue
  fi
  # skip if header already present
  if grep -q "HEADER MATRIX" "$f" 2>/dev/null; then
    continue
  fi
  filename="$(basename "$f")"
  relpath="${f#$ROOT/}"
  tmpfile=$(mktemp)
  printf "%s\n" "${HEADER//$'[filename]'/"$filename"}" > "$tmpfile"
  printf "%s\n" "# [📍] PATH: $relpath" >> "$tmpfile"
  printf "\n" >> "$tmpfile"
  cat "$f" >> "$tmpfile"
  mv "$tmpfile" "$f"
  echo "Prepended header to: $relpath"
done

exit 0
