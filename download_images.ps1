# PowerShell script to download all images
$images = @(
    @{Name="burger-3.jpg"; Url="https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2000&auto=format&fit=crop"},
    @{Name="pizza-1.jpg"; Url="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop"},
    @{Name="fries-1.jpg"; Url="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop"},
    @{Name="salad-1.jpg"; Url="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"},
    @{Name="onion-rings.jpg"; Url="https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=1000&auto=format&fit=crop"},
    @{Name="chicken-wings.jpg"; Url="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=1000&auto=format&fit=crop"},
    @{Name="bread-1.jpg"; Url="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop"},
    @{Name="sauces.jpg"; Url="https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=1000&auto=format&fit=crop"},
    @{Name="drink-1.jpg"; Url="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1000&auto=format&fit=crop"},
    @{Name="drink-2.jpg"; Url="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1000&auto=format&fit=crop"},
    @{Name="promo-1.jpg"; Url="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1200&auto=format&fit=crop"}
)

foreach ($image in $images) {
    $outputPath = "public/images/$($image.Name)"
    Write-Host "Downloading $($image.Name)..."
    try {
        Invoke-WebRequest -Uri $image.Url -OutFile $outputPath
        Write-Host "Downloaded $($image.Name) successfully"
    } catch {
        Write-Host "Failed to download $($image.Name): $($_.Exception.Message)"
    }
}

Write-Host "All downloads completed!"
