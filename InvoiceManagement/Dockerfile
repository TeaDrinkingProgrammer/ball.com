FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["InvoiceManagement/InvoiceManagement.csproj", "InvoiceManagement/"]
RUN dotnet restore "InvoiceManagement/InvoiceManagement.csproj"
COPY . .
WORKDIR "/src/InvoiceManagement"
RUN dotnet build "InvoiceManagement.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "InvoiceManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "InvoiceManagement.dll"]
