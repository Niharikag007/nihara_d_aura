Add-Type -AssemblyName System.Drawing

$dir = "d:\Nihara\Nihara D Aura\frontend\public\images\nails"
if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

$img1 = [System.Drawing.Bitmap]::FromFile('C:\Users\ecogr\.gemini\antigravity-ide\brain\9c119e49-cd82-4ec2-83bf-27191d798264\.user_uploaded\media_1792052182906.png')

$cols1 = @(21, 216, 412, 608)
$r1_y = 22
$r2_y = 370
$w1 = 170
$h1 = 156

for ($i = 0; $i -lt 4; $i++) {
    $rect = New-Object System.Drawing.Rectangle($cols1[$i], $r1_y, $w1, $h1)
    $crop = $img1.Clone($rect, $img1.PixelFormat)
    $crop.Save("$dir\nail_img_$(1 + $i).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
}

for ($i = 0; $i -lt 4; $i++) {
    $rect = New-Object System.Drawing.Rectangle($cols1[$i], $r2_y, $w1, $h1)
    $crop = $img1.Clone($rect, $img1.PixelFormat)
    $crop.Save("$dir\nail_img_$(5 + $i).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
}
$img1.Dispose()

$img2 = [System.Drawing.Bitmap]::FromFile('C:\Users\ecogr\.gemini\antigravity-ide\brain\9c119e49-cd82-4ec2-83bf-27191d798264\.user_uploaded\media_1792052215006.png')

$cols2 = @(21, 215, 411, 606)
$w2 = 168
$h2 = 156

for ($i = 0; $i -lt 4; $i++) {
    $rect = New-Object System.Drawing.Rectangle($cols2[$i], $r1_y, $w2, $h2)
    $crop = $img2.Clone($rect, $img2.PixelFormat)
    $crop.Save("$dir\nail_img_$(9 + $i).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
}

for ($i = 0; $i -lt 4; $i++) {
    $rect = New-Object System.Drawing.Rectangle($cols2[$i], $r2_y, $w2, $h2)
    $crop = $img2.Clone($rect, $img2.PixelFormat)
    $crop.Save("$dir\nail_img_$(13 + $i).png", [System.Drawing.Imaging.ImageFormat]::Png)
    $crop.Dispose()
}
$img2.Dispose()

Write-Host "Pixel-perfect crops saved in $dir"
