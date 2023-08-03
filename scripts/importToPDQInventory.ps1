<#
 # Basically this is possible because of the PDQInventory command line interface.
 # See documentation here: https://help.pdq.com/hc/en-us/articles/360050686511-PDQ-Command-Line-Interface-CLI- 
 # Bobby Jonkman
 #>

# define path to PDQInventory.exe.
$PDQInvExecPath = " ${env:ProgramFiles(x86)}\Admin Arsenal\PDQ Inventory\PDQInventory.exe"
# define path to the .csv exported from web app. presumably Downloads folder.
$FullPathToOutputCSV = [Environment]::GetFolderPath("UserProfile") + "\Downloads\dell-warranty-info.csv"
# define the name of your PDQ Inventory custom field that will store the "Ship Date" field from the API query.
$ShipDateCustomFieldName = "Purchase Date"
# define the name of your PDQ Inventory custom field that will store the entitlement end date from the API query.
$WarrantyEndDateCustomFieldName = "Warranty End Date"

# create custom fields.
& $PDQInvExecPath CreateCustomField -Name "$ShipDateCustomFieldName" -Type DateTime
& $PDQInvExecPath CreateCustomField -Name "$WarrantyEndDateCustomFieldName" -Type DateTime

Write-Output "Importing data into PDQ Inventory..."
# import data into PDQInventory. https://www.pdq.com/blog/adding-custom-fields-multiple-computers-powershell/
& $PDQInvExecPath ImportCustomFields -FileName "$FullPathToOutputCSV" -ComputerColumn "Computer Name" -CustomFields "$ShipDateCustomFieldName=$ShipDateCustomFieldName,$WarrantyEndDateCustomFieldName=$WarrantyEndDateCustomFieldName" -AllowOverwrite
Write-Output "Finished!!"