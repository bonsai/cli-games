# Web HTML ファイル名リネームスクリプト
# ジャンル-ゲーム名.html 形式に変換

$webDir = "C:\Users\dance\Documents\MEGA\novg\web"
$renames = @{
  # シューティング
  "CC-mediapipe-shooting.html" = "shooting-CC-mediapip.html"
  "shooting-mediapipe-shooting.html" = "shooting-mediapipe-shooting.html"
  
  # アクション
  "action-pong.html" = "action-pong.html"
  "baku_99_tablet.html" = "action-baku99-tablet.html"
  "baku_99.html" = "action-baku99.html"
  "kd_hybrid.html" = "action-kd-hybrid.html"
  "kd_light_sword_game.html" = "action-kd-light-sword.html"
  "sdg.html" = "action-sdg.html"
  "99suika.html" = "action-99suika.html"
  "99conecc.html" = "action-99conecc.html"
  "sumo.html" = "action-sumo.html"
  "sankaku.html" = "action-sankaku.html"
  "omu.html" = "action-omu.html"
  "dia.html" = "action-dia.html"
  "blind_fishing.html" = "action-blind-fishing.html"
  "olgol.html" = "action-olgol.html"
  "kids_music_box.html" = "action-kids-music-box.html"
  "kd.html" = "action-kd.html"
  "touch.html" = "action-touch.html"
  "domino-3d.html" = "action-domino3d.html"
  "simple_vacuum.html" = "puzzle-vacuum.html"
  "simple_vacuum_game.html" = "puzzle-vacuum-game.html"
  "math_vacuum_game.html" = "puzzle-math-vacuum.html"
  
  # ノベル
  "drive_quiz.html" = "novel-drive-quiz.html"
  "flags.html" = "novel-flags.html"
  "kanji.html" = "novel-kanji.html"
  "kanji-plate.html" = "novel-kanji-plate.html"
  "tokugawa.html" = "novel-tokugawa.html"
  
  # タイピング
  "2music_country_quiz.html" = "typing-music-country-2.html"
  "music_country_quiz.html" = "typing-music-country.html"
  
  # お絵かき
  "kaleidoscope2.html" = "draw-kaleidoscope2.html"
  "web_shodo.html" = "draw-shodo.html"
  "touchkaleido.html" = "draw-touchkaleido.html"
}

foreach ($old in $renames.Keys) {
  $oldPath = Join-Path $webDir $old
  $newName = $renames[$old]
  $newPath = Join-Path $webDir $newName
  
  if (Test-Path $oldPath) {
    if (-not (Test-Path $newPath)) {
      Rename-Item -Path $oldPath -NewName $newName
      Write-Host "Renamed: $old -> $newName"
    } else {
      Write-Host "Skipped (exists): $old -> $newName"
    }
  } else {
    Write-Host "Not found: $old"
  }
}

Write-Host "`nDone!"