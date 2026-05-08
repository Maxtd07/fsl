namespace SoccerDreamFermana.Backend.Exceptions;

public class BadRequestException(string message) : Exception(message);

public class ResourceNotFoundException(string message) : Exception(message);

public class ForbiddenAccessException(string message) : Exception(message);
